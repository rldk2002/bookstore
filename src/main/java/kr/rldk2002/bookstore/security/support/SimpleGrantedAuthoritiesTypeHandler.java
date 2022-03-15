package kr.rldk2002.bookstore.security.support;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@MappedJdbcTypes(JdbcType.VARCHAR)
public class SimpleGrantedAuthoritiesTypeHandler extends BaseTypeHandler<Set<SimpleGrantedAuthority>> {

    @Override
    public void setNonNullParameter(PreparedStatement preparedStatement, int i, Set<SimpleGrantedAuthority> roles, JdbcType jdbcType) throws SQLException {
        String param = roles.stream().map(SimpleGrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        preparedStatement.setString(i, param);
    }

    @Override
    public Set<SimpleGrantedAuthority> getNullableResult(ResultSet resultSet, String columnName) throws SQLException {
        String authorities = resultSet.getString(columnName);
        if (authorities == null) {
            return Set.of();
        }
        return Arrays.stream(authorities.split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }

    @Override
    public Set<SimpleGrantedAuthority> getNullableResult(ResultSet resultSet, int columnIndex) throws SQLException {
        String authorities = resultSet.getString(columnIndex);
        if (authorities == null) {
            return Set.of();
        }
        return Arrays.stream(authorities.split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }

    @Override
    public Set<SimpleGrantedAuthority> getNullableResult(CallableStatement callableStatement, int columnIndex) throws SQLException {
        String authorities = callableStatement.getString(columnIndex);
        if (authorities == null) {
            return Set.of();
        }
        return Arrays.stream(authorities.split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }
}
