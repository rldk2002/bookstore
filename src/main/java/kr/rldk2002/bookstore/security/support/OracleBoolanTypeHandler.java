package kr.rldk2002.bookstore.security.support;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class OracleBoolanTypeHandler extends BaseTypeHandler<Boolean> {

    @Override
    public void setNonNullParameter(PreparedStatement preparedStatement, int i, Boolean aBoolean, JdbcType jdbcType) throws SQLException {
        preparedStatement.setInt(i, aBoolean ? 1 : 0);
    }

    @Override
    public Boolean getNullableResult(ResultSet resultSet, String columnName) throws SQLException {
        return resultSet.getInt(columnName) != 0;
    }

    @Override
    public Boolean getNullableResult(ResultSet resultSet, int columnIndex) throws SQLException {
        return resultSet.getInt(columnIndex) != 0;
    }

    @Override
    public Boolean getNullableResult(CallableStatement callableStatement, int columnIndex) throws SQLException {
        return callableStatement.getInt(columnIndex) != 0;
    }
}
